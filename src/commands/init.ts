import { Command, Flags } from '@oclif/core'
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { buildBaseline } from '../lib/baseline.js'
import { injectForIdes } from '../lib/injector.js'
import {
  loadResolvedConfig,
  writeDefaultConfigFile,
} from '../lib/reopenspec-config.js'
import { runMcpInteractiveSetup } from '../lib/mcp-interactive-setup.js'
import {
  copyProjectYamlTemplate,
  copyReopenSpecModelDocIfMissing,
  copyWorkflowCommandsToProject,
} from '../lib/workflow-copy.js'

export default class Init extends Command {
  static override id = 'init'
  static override description =
    'Create reopenspec/docs/, reopenspec/specs/.meta, reopenspec/changes/active/ and reopenspec/changes/completed/, scan TypeScript, write arch-baseline.json, reopenspec.json, inject IDE workflows, copy Cursor slash-command templates to .cursor/commands/, optionally configure MCP in ~/.cursor/mcp.json, and add reopenspec.project.yaml if missing (use --skip-workflow / --skip-mcp-setup to opt out).'
  static override examples = [
    '<%= config.bin %> init',
    '<%= config.bin %> init -c . --force',
    '<%= config.bin %> init --skip-workflow',
    '<%= config.bin %> init --skip-mcp-setup',
  ]

  static override flags = {
    cwd: Flags.string({
      char: 'c',
      default: '.',
      description: 'Workspace root',
    }),
    force: Flags.boolean({
      description: 'Overwrite existing reopenspec.json',
      default: false,
    }),
    skipInject: Flags.boolean({
      description: 'Do not write Cursor / .ai-context workflow files',
      default: false,
    }),
    skipWorkflow: Flags.boolean({
      description:
        'Do not copy slash-command templates to .cursor/commands/ or add reopenspec.project.yaml',
      default: false,
    }),
    skipMcpSetup: Flags.boolean({
      description:
        'Do not prompt to merge MCP server entries into ~/.cursor/mcp.json (Cursor user config)',
      default: false,
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Init)
    const cwd = resolve(flags.cwd)

    const rs = join(cwd, 'reopenspec')
    mkdirSync(join(rs, 'docs'), { recursive: true })
    mkdirSync(join(rs, 'changes', 'active'), { recursive: true })
    mkdirSync(join(rs, 'changes', 'completed'), { recursive: true })
    mkdirSync(join(rs, 'specs', '.meta'), { recursive: true })
    mkdirSync(join(rs, 'specs'), { recursive: true })

    const gitignorePath = join(cwd, '.gitignore')
    if (existsSync(gitignorePath)) {
      const gitignoreContent = readFileSync(gitignorePath, 'utf8')
      if (!gitignoreContent.includes('.reopenspec.user.yaml')) {
        appendFileSync(gitignorePath, '\n# ReOpenSpec local user profile\n.reopenspec.user.yaml\n')
        this.log('Added .reopenspec.user.yaml to .gitignore')
      }
    } else {
      writeFileSync(gitignorePath, '# ReOpenSpec local user profile\n.reopenspec.user.yaml\n')
      this.log('Created .gitignore and added .reopenspec.user.yaml')
    }

    const before = loadResolvedConfig(cwd)
    if (!before.fileExists || flags.force) {
      const p = writeDefaultConfigFile(cwd, flags.force)
      this.log(`Wrote ${p}`)
    } else {
      this.log(`Using existing config: ${before.filePath}`)
    }

    const { merged: cfg } = loadResolvedConfig(cwd)
    const baselinePath = resolve(cwd, cfg.baselinePath)

    const baseline = await buildBaseline(cwd)
    writeFileSync(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`, 'utf8')
    this.log(`Wrote ${baselinePath}`)

    if (baseline.parseErrors.length > 0) {
      this.warn(`${baseline.parseErrors.length} baseline parse error(s); see "parseErrors" in baseline file.`)
    }

    if (!flags.skipInject) {
      const injections = injectForIdes(cwd)
      for (const inj of injections) {
        if (inj.paths.length > 0) {
          this.log(`Injected (${inj.ide}): ${inj.paths.join(', ')}`)
        } else {
          this.log(`IDE marker: ${inj.ide} (no files written for this target yet)`)
        }
      }
    }

    try {
      const modelDoc = copyReopenSpecModelDocIfMissing(cwd)
      if (modelDoc) {
        this.log(`Wrote ${modelDoc} (template)`)
      }
    } catch (e) {
      this.warn(e instanceof Error ? e.message : String(e))
    }

    if (!flags.skipWorkflow) {
      try {
        const copied = copyWorkflowCommandsToProject(cwd)
        for (const p of copied) {
          this.log(`Workflow command: ${p}`)
        }
        const yaml = copyProjectYamlTemplate(cwd)
        if (yaml) {
          this.log(`Wrote ${yaml} (template)`)
        } else {
          this.log('reopenspec.project.yaml already exists; left unchanged')
        }
      } catch (e) {
        this.warn(
          e instanceof Error ? e.message : String(e),
        )
      }
    }

    await runMcpInteractiveSetup({
      workspaceRoot: cwd,
      skip: flags.skipMcpSetup,
      ide: 'cursor',
      log: (m) => this.log(m),
      warn: (m) => this.warn(m),
    })

    this.log(
      `Summary: ${baseline.modules.length} module(s), ${baseline.nodes.length} export node(s), languages: ${baseline.meta.languages.join(', ') || '(none)'}`,
    )
  }
}
