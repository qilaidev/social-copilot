审核测试说明：

1. 安装扩展后打开扩展弹窗。
2. 在 Provider 中选择 DeepSeek、OpenAI、Claude、NVIDIA 或内置模型服务，并填写对应 API Key；如果没有可用 Key，可先检查设置页、隐私确认、候选数量、语言和高级配置是否正常展示。
3. 打开 https://web.telegram.org/、https://web.whatsapp.com/ 或 https://app.slack.com/ 并进入一个聊天。
4. 收到或输入消息后，建议面板会显示轻量语气/意图提示、思路卡片和候选回复。
5. 点击候选回复会填充到输入框；点击 Copy 可复制候选文本。
6. 高级自动代理功能默认关闭，只在 Advanced mode 中展示；首次开启会提示误发风险，群聊不会自动发送。
7. 诊断导出不包含聊天原文和 API Key，只包含错误码、是否可重试、provider/model、适配器命中摘要等排障字段。
