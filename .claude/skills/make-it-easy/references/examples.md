# Examples

Before and after pairs for each surface. Load this when a judgment call is unclear.

## Code comments

Bad, restates the code and narrates the edit:

```python
# Loop over all the users in the list
for user in users:
    # Increment the counter by one
    count += 1

# NOTE: refactored this from the old helper in utils.py during review
def normalize(name: str) -> str:
    """
    This function normalizes a name.

    Args:
        name (str): the name to normalize
    Returns:
        str: the normalized name
    """
    return name.strip().lower()
```

Good, no comment where the code speaks, docstring trimmed to what is not obvious:

```python
for user in users:
    count += 1


def normalize(name: str) -> str:
    """Lowercase and trim a name for case-insensitive matching."""
    return name.strip().lower()
```

Good, a comment that earns its place:

```python
# Snowflake returns TIMESTAMP_NTZ here, so treat it as UTC before comparing.
ts = value.replace(tzinfo=timezone.utc)

# Retry 3 times: the upstream API returns 502 on cold start (MONDE-509).
for attempt in range(3):
    ...
```

## Documentation

Bad:

```markdown
## Getting your local development environment up and running

In order to be able to start working with this project, you will first need to
make sure that you have all of the required dependencies installed on your
machine. This project relies on Python, and it is generally recommended that you
use a virtual environment so as to avoid any potential conflicts...
```

Good:

```markdown
## Run locally

Requires Python 3.11.

    python -m venv .venv
    .venv/bin/pip install -r requirements.txt
    .venv/bin/python -m app

If port 8000 is busy, set `APP_PORT`.
```

## Chat replies

Bad, narrates the process and buries the result:

> I started by searching the repository for the retry logic. I found it in
> `client.py` and also checked `config.py` to understand how the timeout is
> configured. After reading both files, I decided the cleanest approach was to
> move the retry count into the config, so I edited `config.py` to add a new
> setting and then updated `client.py` to read it. I also ran the tests, and it
> looks like two of them are failing, which may be related to a fixture.

Good:

> Retry count is now configurable. 2 tests fail.
> - `config.py:18` adds `RETRY_COUNT`, default 3.
> - `client.py:64` reads it instead of the hardcoded 3.
> - Failing: `test_client.py::test_retry_backoff` and `::test_retry_limit`, both expect the old constant. Want me to update the fixtures?

Bad, no point in the first line:

> I have finished looking into the question you asked about the pipeline.
> There are a few things worth mentioning here...

Good:

> The pipeline is fine, nothing for you to do.
> The 3am alert came from a one-off Airflow worker restart, not the DAG.

## Commit message

Bad:

```
Updated files

Changed config.py and client.py and also modified the tests folder because
the retry logic needed to be configurable as discussed.
```

Good:

```
Make retry count configurable

The upstream API cold-starts slowly in staging, so the fixed count of 3
was not enough there. Now set per environment.

- RETRY_COUNT setting, default 3
- client reads the setting instead of a constant
```
