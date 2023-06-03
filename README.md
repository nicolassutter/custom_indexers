# Custom Indexers

Following the closure of Rarbg, I decided to create a [Jackett](https://github.com/Jackett/Jackett) indexer to still access the site and be able to search through it.

## How it works

From a backup (SQLite database) of every torrent I found online, I created a simple REST API that queries that db and returns the results in a format that Jackett understands.

## Access to the database

I will not be hosting the database here on Github.

If you would like to access it, you could try to DM me.

## Get started

1. Run the Docker image and set the following env variables:

    - `DATABASE_URL=/path/to/file/in/container/db.sqlite`

    > You might want to use a volume for the database file. `docker run ... -v /path/to/file/on/host/system/db.sqlite:/path/to/file/in/container/db.sqlite`

2. Copy the content of [this file](./packages/rarbg/rarbg_custom.yml) to your Jackett `Definitions` folder.

    > You might want to use a volume for the database file when running your Jackett container. `docker run ... -v /path/to/file/on/host/system/rarbg_custom.yml:/app/Jackett/Definitions/rarbg_custom.yml`

    **Note**: Do not forget to change the `links` inside `rarbg_custom.yml` to match the url of your API's container, otherwiser Jackett won't be able to communicate with the custom Rarbg API we set up earlier.

3. That's pretty much it, you just need to configure your indexer with Jackett's UI.
