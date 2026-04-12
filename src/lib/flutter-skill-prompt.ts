export interface FlutterSkillPromptOptions {
  linePrefix?: string
}

export async function offerFlutterSkillsGuidance(
  log: (msg: string) => void,
  options?: FlutterSkillPromptOptions
): Promise<void> {
  const prefix = options?.linePrefix ?? ''
  log(`${prefix}📱 Flutter/Dart stack detected.`)
  log(`${prefix}Tip: Check out ReOpenSpec's Flutter UI/State management skills for AI.`)
}
