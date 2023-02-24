# 🪡 NeedleworkCore - CD Metadata Processor
A command-line script that downloads and processes metadata from CommunityDragon.
Currently only processes emote metadatas. owo

Integral part of a project not yet released.

## Requirements
    - Git
    - Node

## Options
```shell
-d, --diff        # compare processed metadata and generate JSON diff files
-g, --get         # get and download data images associated with metadata
-p, --path <path> # base output path for folders and files (REQUIRED)
```

## Usage
```shell
> git clone https://github.com/BlossomiShymae/NeedleworkCore.git

> npm i

> npm run start -- --diff --get --path "."
```
