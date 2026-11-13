import type { ReplyCandidate, ThoughtCard, ThoughtType } from '@social-copilot/core';
import { debugWarn } from '../utils/debug';
import { storageLocalGet, storageLocalSet } from '../utils/webext';
import { ThoughtCardsComponent } from './thought-cards';

interface CopilotUIOptions {
  onSelect: (candidate: ReplyCandidate) => void;
  onCopy?: (candidate: ReplyCandidate) => void;
  onRefresh: () => void;
  onThoughtSelect?: (thought: ThoughtType | null) => void;
  onPrivacyAcknowledge?: () => void;
  onOpenSettings?: () => void;
}

/**
 * Copilot 悬浮 UI 组件
 */
export class CopilotUI {
  private container: HTMLElement | null = null;
  private options: CopilotUIOptions;
  private candidates: ReplyCandidate[] = [];
  private isLoading = false;
  private error: string | null = null;
  private notification: string | null = null;
  private privacyPrompt: string | null = null;
  private toneSummary: string | null = null;
  private position: { top: number; left: number } | null = null;
  private dragStart: { x: number; y: number; top: number; left: number } | null = null;
  private readonly positionStorageKey = `sc-panel-pos-${location.host}`;

  // 事件处理器引用，用于清理
  private closeHandler: (() => void) | null = null;
  private refreshHandler: (() => void) | null = null;
  private candidateClickHandler: ((e: Event) => void) | null = null;

  // 思路卡片组件
  private thoughtCards: ThoughtCardsComponent;

  constructor(options: CopilotUIOptions) {
    this.options = options;
    this.thoughtCards = new ThoughtCardsComponent({
      onSelect: (thought) => {
        this.options.onThoughtSelect?.(thought);
      },
    });
  }

  mount() {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.id = 'social-copilot-root';
    this.container.appendChild(this.render());
    document.body.appendChild(this.container);
    this.applyPosition();
    void this.restorePosition();

    this.bindEvents();

    // 渲染思路卡片
    const contentEl = this.container.querySelector('.sc-content');
    if (contentEl) {
      this.thoughtCards.render(contentEl as HTMLElement);
    }
  }

  unmount() {
    this.unbindEvents();
    this.detachDragListeners();
    this.thoughtCards.destroy();
    this.container?.remove();
    this.container = null;
    this.candidates = [];
  }

  show() {
    if (this.container) {
      this.container.style.display = 'block';
    }
  }

  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
    this.error = null;
    this.privacyPrompt = null;
    this.update();
  }

  setError(error: string) {
    this.error = error;
    this.isLoading = false;
    this.privacyPrompt = null;
    this.notification = null;
    this.update();
  }

  setCandidates(candidates: ReplyCandidate[]) {
    this.candidates = candidates;
    this.isLoading = false;
    this.error = null;
    this.privacyPrompt = null;
    this.update();
    this.show();
  }

  setToneSummary(summary: string | null | undefined) {
    const normalized = typeof summary === 'string' ? summary.trim() : '';
    this.toneSummary = normalized || null;
    this.update();
  }

  setNotification(message: string) {
    this.notification = message;
    this.update();
    this.show();
  }

  clearNotification() {
    this.notification = null;
    this.update();
  }

  setPrivacyPrompt(message: string) {
    this.privacyPrompt = message;
    this.isLoading = false;
    this.error = null;
    this.notification = null;
    this.candidates = [];
    this.thoughtCards.setCards([]);
    this.toneSummary = null;
    this.update();
    this.show();
  }

  clearPrivacyPrompt() {
    if (!this.privacyPrompt) return;
    this.privacyPrompt = null;
    this.update();
  }

  setThoughtCards(cards: ThoughtCard[]) {
    this.thoughtCards.setCards(cards);
  }

  getSelectedThought(): ThoughtType | null {
    return this.thoughtCards.getSelectedThought();
  }

  getThoughtAbortController(): AbortController {
    return this.thoughtCards.createAbortController();
  }

  private render(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'sc-panel';

    const header = document.createElement('div');
    header.className = 'sc-header';

    const title = document.createElement('span');
    title.className = 'sc-title';
    title.textContent = '💬 Social Copilot';

    const shortcut = document.createElement('span');
    shortcut.className = 'sc-shortcut';
    shortcut.setAttribute('title', '快捷键');
    shortcut.textContent = 'Alt+S';

    const refresh = document.createElement('button');
    refresh.className = 'sc-refresh';
    refresh.setAttribute('type', 'button');
    refresh.setAttribute('title', '刷新建议');
    refresh.textContent = '↻';

    const close = document.createElement('button');
    close.className = 'sc-close';
    close.setAttribute('type', 'button');
    close.setAttribute('title', '关闭 (Esc)');
    close.textContent = '✕';

    header.appendChild(title);
    header.appendChild(shortcut);
    header.appendChild(refresh);
    header.appendChild(close);

    const content = document.createElement('div');
    content.className = 'sc-content';
    content.appendChild(this.renderContent());

    panel.appendChild(header);
    panel.appendChild(content);

    return panel;
  }

  private renderContent(): DocumentFragment {
    const frag = document.createDocumentFragment();

    const notice = this.renderNotification();
    if (notice) frag.appendChild(notice);

    const tone = this.renderToneSummary();
    if (tone) frag.appendChild(tone);

    if (this.privacyPrompt) {
      const wrap = document.createElement('div');
      wrap.className = 'sc-privacy';

      const title = document.createElement('div');
      title.className = 'sc-privacy-title';
      title.textContent = '隐私提示';

      const text = document.createElement('div');
      text.className = 'sc-privacy-text';
      text.textContent = this.privacyPrompt;

      const ack = document.createElement('button');
      ack.className = 'sc-privacy-ack';
      ack.setAttribute('type', 'button');
      ack.setAttribute('tabindex', '0');
      ack.textContent = '我已理解，继续';

      const sub = document.createElement('div');
      sub.className = 'sc-privacy-sub';
      sub.textContent = '你也可以在扩展设置中随时调整脱敏/匿名化与发送范围。';

      wrap.appendChild(title);
      wrap.appendChild(text);
      wrap.appendChild(ack);
      wrap.appendChild(sub);
      frag.appendChild(wrap);
      return frag;
    }

    if (this.isLoading) {
      const el = document.createElement('div');
      el.className = 'sc-loading';
      el.textContent = '正在生成建议...';
      frag.appendChild(el);
      return frag;
    }

    if (this.error) {
      if (this.error === 'NO_API_KEY') {
        const el = document.createElement('div');
        el.className = 'sc-error';
        el.appendChild(document.createTextNode('未配置 API Key'));

        const btn = document.createElement('button');
        btn.className = 'sc-privacy-ack';
        btn.setAttribute('data-action', 'open-settings');
        btn.style.marginTop = 'var(--sc-space-sm)';
        btn.textContent = '前往设置';

        el.appendChild(btn);
        frag.appendChild(el);
        return frag;
      }

      const el = document.createElement('div');
      el.className = 'sc-error';
      el.textContent = this.error;

      const retry = document.createElement('button');
      retry.className = 'sc-inline-action';
      retry.setAttribute('type', 'button');
      retry.setAttribute('data-action', 'retry');
      retry.textContent = '重试';
      el.appendChild(retry);

      frag.appendChild(el);
      return frag;
    }

    if (this.candidates.length === 0) {
      const el = document.createElement('div');
      el.className = 'sc-empty';
      el.textContent = '等待新消息...';
      frag.appendChild(el);
      return frag;
    }

    for (const [index, candidate] of this.candidates.entries()) {
      const el = document.createElement('div');
      el.className = 'sc-candidate';
      el.setAttribute('data-index', String(index));
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');

      const style = document.createElement('span');
      style.className = 'sc-style';
      style.textContent = this.getStyleLabel(candidate.style);

      const text = document.createElement('p');
      text.className = 'sc-text';
      text.textContent = candidate.text;

      const actions = document.createElement('div');
      actions.className = 'sc-candidate-actions';

      const insert = document.createElement('span');
      insert.className = 'sc-candidate-hint';
      insert.textContent = '点击插入';

      const copy = document.createElement('button');
      copy.className = 'sc-copy';
      copy.setAttribute('type', 'button');
      copy.setAttribute('data-action', 'copy-candidate');
      copy.setAttribute('data-index', String(index));
      copy.setAttribute('title', '复制这条回复');
      copy.textContent = '复制';

      actions.appendChild(insert);
      actions.appendChild(copy);

      el.appendChild(style);
      el.appendChild(text);
      el.appendChild(actions);
      frag.appendChild(el);
    }

    return frag;
  }

  private renderToneSummary(): HTMLElement | null {
    if (!this.toneSummary) return null;
    const el = document.createElement('div');
    el.className = 'sc-tone-summary';
    el.textContent = this.toneSummary;
    return el;
  }

  private renderNotification(): HTMLElement | null {
    if (!this.notification) return null;
    const el = document.createElement('div');
    el.className = 'sc-notice';
    el.textContent = this.notification;
    return el;
  }

  private getStyleLabel(style: string): string {
    const labels: Record<string, string> = {
      humorous: '😄 幽默',
      caring: '💗 关心',
      rational: '🧠 理性',
      casual: '😊 随意',
      formal: '📝 正式',
    };
    return labels[style] || style;
  }

  private update() {
    const content = this.container?.querySelector('.sc-content');
    if (content) {
      while (content.firstChild) content.removeChild(content.firstChild);
      content.appendChild(this.renderContent());
      // 重新渲染思路卡片
      this.thoughtCards.render(content as HTMLElement);
    }
  }

  private bindEvents() {
    if (!this.container) return;

    const closeBtn = this.container.querySelector('.sc-close');
    const refreshBtn = this.container.querySelector('.sc-refresh');
    const contentEl = this.container.querySelector('.sc-content');

    // 关闭按钮
    this.closeHandler = () => this.hide();
    closeBtn?.addEventListener('click', this.closeHandler);

    // 刷新按钮
    this.refreshHandler = () => this.options.onRefresh();
    refreshBtn?.addEventListener('click', this.refreshHandler);

    // 使用事件委托处理候选项点击，避免重复绑定
    this.candidateClickHandler = (e: Event) => {
      const target = e.target as HTMLElement;
      const candidateEl = target.closest('.sc-candidate');

      // 处理键盘事件 (Enter/Space)
      if (e.type === 'keydown') {
        const keyEvent = e as KeyboardEvent;
        if (!candidateEl) return;
        if (keyEvent.key !== 'Enter' && keyEvent.key !== ' ') {
          return;
        }
        // 防止 Space 键滚动页面
        if (keyEvent.key === ' ') {
          keyEvent.preventDefault();
        }

        const index = parseInt(candidateEl.getAttribute('data-index') || '0', 10);
        const candidate = this.candidates[index];
        if (candidate) {
          this.options.onSelect(candidate);
        }
        return;
      }

      const ackBtn = target.closest('.sc-privacy-ack');
      if (ackBtn) {
        if (ackBtn.getAttribute('data-action') === 'open-settings') {
          this.options.onOpenSettings?.();
        } else {
          this.options.onPrivacyAcknowledge?.();
        }
        return;
      }

      const retryBtn = target.closest('[data-action="retry"]');
      if (retryBtn) {
        this.options.onRefresh();
        return;
      }

      const copyBtn = target.closest('[data-action="copy-candidate"]');
      if (copyBtn) {
        const index = parseInt(copyBtn.getAttribute('data-index') || '-1', 10);
        const candidate = this.candidates[index];
        if (candidate) {
          this.options.onCopy?.(candidate);
        }
        return;
      }

      if (candidateEl) {
        const index = parseInt(candidateEl.getAttribute('data-index') || '0', 10);
        const candidate = this.candidates[index];
        if (candidate) {
          this.options.onSelect(candidate);
        }
      }
    };
    contentEl?.addEventListener('click', this.candidateClickHandler);
    contentEl?.addEventListener('keydown', this.candidateClickHandler);

    this.bindDragEvents();
  }

  private bindDragEvents() {
    if (!this.container) return;

    const header = this.container.querySelector('.sc-header');
    header?.addEventListener('mousedown', this.handleDragStart);
  }

  private handleDragStart = (event: Event) => {
    if (!this.container) return;
    if (!(event instanceof MouseEvent)) return;
    if (event.button !== 0) return;

    const target = event.target as HTMLElement;
    if (target.closest('button')) return;

    const rect = this.container.getBoundingClientRect();
    this.dragStart = {
      x: event.clientX,
      y: event.clientY,
      top: this.position?.top ?? rect.top,
      left: this.position?.left ?? rect.left,
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
    document.addEventListener('mousemove', this.handleDragMove);
    document.addEventListener('mouseup', this.handleDragEnd);
    event.preventDefault();
  };

  private handleDragMove = (event: MouseEvent) => {
    if (!this.dragStart || !this.container) return;

    const nextLeft = this.dragStart.left + (event.clientX - this.dragStart.x);
    const nextTop = this.dragStart.top + (event.clientY - this.dragStart.y);
    this.position = this.clampPosition(nextLeft, nextTop);
    this.applyPosition();
  };

  private handleDragEnd = () => {
    if (!this.dragStart) return;

    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    this.detachDragListeners();
    void this.savePosition();
  };

  private detachDragListeners() {
    document.removeEventListener('mousemove', this.handleDragMove);
    document.removeEventListener('mouseup', this.handleDragEnd);
    this.dragStart = null;
  }

  private clampPosition(left: number, top: number): { top: number; left: number } {
    const margin = 8;
    const rect = this.container?.getBoundingClientRect();
    const width = rect?.width ?? 320;
    const height = rect?.height ?? 240;

    const maxLeft = Math.max(margin, window.innerWidth - width - margin);
    const maxTop = Math.max(margin, window.innerHeight - height - margin);

    return {
      left: Math.min(Math.max(left, margin), maxLeft),
      top: Math.min(Math.max(top, margin), maxTop),
    };
  }

  private applyPosition() {
    if (!this.container) return;

    if (this.position) {
      this.container.style.left = `${this.position.left}px`;
      this.container.style.top = `${this.position.top}px`;
      this.container.style.right = 'auto';
      this.container.style.bottom = 'auto';
    } else {
      this.container.style.left = 'auto';
      this.container.style.top = 'auto';
      this.container.style.right = '20px';
      this.container.style.bottom = '80px';
    }
  }

  private async restorePosition() {
    try {
      const result = await storageLocalGet(this.positionStorageKey);
      const saved = result[this.positionStorageKey] as { top?: number; left?: number } | undefined;

      if (saved && typeof saved.top === 'number' && typeof saved.left === 'number') {
        this.position = this.clampPosition(saved.left, saved.top);
      }
    } catch (error) {
      debugWarn('[Social Copilot] Failed to restore panel position', error);
    } finally {
      this.applyPosition();
    }
  }

  private async savePosition() {
    if (!this.position) return;

    try {
      await storageLocalSet({
        [this.positionStorageKey]: this.position,
      });
    } catch (error) {
      debugWarn('[Social Copilot] Failed to save panel position', error);
    }
  }

  private unbindEvents() {
    if (!this.container) return;

    const closeBtn = this.container.querySelector('.sc-close');
    const refreshBtn = this.container.querySelector('.sc-refresh');
    const contentEl = this.container.querySelector('.sc-content');

    if (this.closeHandler) {
      closeBtn?.removeEventListener('click', this.closeHandler);
      this.closeHandler = null;
    }

    if (this.refreshHandler) {
      refreshBtn?.removeEventListener('click', this.refreshHandler);
      this.refreshHandler = null;
    }

    if (this.candidateClickHandler) {
      contentEl?.removeEventListener('click', this.candidateClickHandler);
      contentEl?.removeEventListener('keydown', this.candidateClickHandler);
      this.candidateClickHandler = null;
    }

    this.container.querySelector('.sc-header')?.removeEventListener('mousedown', this.handleDragStart);
  }
}
