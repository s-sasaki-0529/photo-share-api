# Photo Share API

[初めてのGraphQL](https://www.oreilly.co.jp/books/9784873118932/) のハンズオンリポジトリ

クライアントサイド
[s-sasaki-0529/photo-share-client](https://github.com/s-sasaki-0529/photo-share-client)

## セットアップ

### mongodb

```bash
$ brew tap mongodb/brew
$ brew install mongodb-community
$ mongod --version
db version v6.0.1
Build Info: {
    "version": "6.0.1",
    "gitVersion": "32f0f9c88dc44a2c8073a5bd47cf779d4bfdee6b",
    "modules": [],
    "allocator": "system",
    "environment": {
        "distarch": "aarch64",
        "target_arch": "aarch64"
    }
}
$ brew services list
$ brew services start mongodb-community
```
