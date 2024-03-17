# Smoke Test

This script is used to ensure that database connections and script running are both working as intended.

# Troubleshooting

If this script fails the following are common points of failure:

- Have you connected to the database via the ssh tunnel?

`ts-node ./bin/smoke-test/smoke-test.ts`
