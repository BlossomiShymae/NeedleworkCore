# 🪡 NeedleworkCore - CommunityDragon Metadata Processor
A command-line executable that downloads and processes metadata from CommunityDragon.
For now, only emote metadatas are processed! (❀❛ ֊ ❛„) ♡ ✧˚ ༘ ⋆｡˚

Integral part of a project not yet released.

## Requirements
    - .NET 7

## Options
```shell
-d|--diff        # Compare data and generate JSON diff files.
-g|--get         # Download data images associated with metadata.
-p|--path <path> # Output path for files and folders. Current working path will be used as default.
```

## Exit Codes
    - 0,    success
    - 100,  success, updated data

## Usage (development)
```shell
> git clone https://github.com/BlossomiShymae/NeedleworkCore.git

# Run. Generate JSON diff files if updated. Download data images if not already.
> dotnet run -- -dg
```
