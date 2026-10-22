# ggrun

A zero-install workflow launcher powered by [gg](https://github.com/eirikb/gg) and [mise](https://mise.jdx.dev/).

`ggrun` lets you run a project's predefined workflow without requiring the user to install `mise` or the tools required by the project.

The project only needs a `mise.toml` describing its workflow.

```text
gg
 ↓
ggrun
 ↓
bootstrap mise
 ↓
mise run
 ↓
mise.toml
 ↓
project workflow
```

## Usage

Run `ggrun` through `gg`:

```bash
gg.cmd npx github:lendle1028/ggrun
```

Arguments after `ggrun` are passed directly to `mise run`.

For example:

```bash
gg.cmd npx github:lendle1028/ggrun dev
```

runs the project's `dev` task:

```bash
mise run dev
```

You can also pass additional arguments:

```bash
gg.cmd npx github:lendle1028/ggrun dev foo bar
```

which becomes:

```bash
mise run dev foo bar
```

If no task is specified:

```bash
gg.cmd npx github:lendle1028/ggrun
```

`ggrun` runs:

```bash
mise run
```

which executes the project's default workflow.

## Project Configuration

Create a `mise.toml` in your project.

For example:

```toml
[tasks.default]
run = "echo Hello from my project!"
```

Then run:

```bash
gg.cmd npx github:lendle1028/ggrun
```

The workflow is bootstrapped automatically and the `default` task is executed.

For more information about configuring workflows with `mise`, see the [mise documentation](https://mise.jdx.dev/).

## Example

A project might define:

```toml
[tasks.default]
run = "uv run app.py"

[tasks.dev]
run = "uv run --reload app.py"
```

Then:

```bash
gg.cmd npx github:lendle1028/ggrun
```

runs the default workflow, while:

```bash
gg.cmd npx github:lendle1028/ggrun dev
```

runs the `dev` workflow.

The user does not need to install `mise` manually.

## How It Works

`ggrun` acts as a small bridge between `gg` and `mise`.

When invoked, it:

1. Ensures that `mise` is available through `gg`.
2. Creates the required `gg` configuration automatically.
3. Lets `mise` handle project configuration and trust.
4. Executes the requested `mise` task.

The user only needs:

```text
gg + mise.toml
```

No separate installation of `mise` is required.

## Trust

`mise.toml` contains executable workflow definitions, so `mise` may ask the user to trust the project's configuration before running it.

This confirmation is intentional. Only trust workflows from projects you trust.

## Requirements

- Node.js
- `gg`

`mise` does not need to be installed manually.

## License

TBD