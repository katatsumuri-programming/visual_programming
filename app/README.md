# Install
## dockerを使用する場合
1. Releasesから```katacode_docker```をダウンロードして任意の場所に展開します
2. docker、docker-composeがインストールされていない場合はインストールします
3. dockerを起動してダウンロードしたファイルを展開したディレクトリで以下のコマンドを実行し起動します
    ```
    docker-compose up -d
    ```
4. http://localhost/ にアクセスすることで利用できます
5. 停止する場合は以下のコマンドを実行します
    ```
    docker-compose stop
    ```
6. その後起動する場合は以下のコマンドを実行します
    ```
    docker-compose start
    ```

## dockerを使用しない場合
1. Releasesから```Sourse code```をダウンロードして任意の場所に展開します
2. mysql、phpを利用できる環境を構築します
3. 下のような構造のテーブルを含むデータベースを作成し、phpからアクセスできるユーザーを作成します

    | Field        | Type     | Null | Key | Default | Extra |
    | ------------ | -------- | ---- | --- | ------- | ----- |
    | id           | char(36) | NO   | PRI | NULL    |       |
    | block_xml    | text     | YES  |     | NULL    |       |
    | code         | text     | YES  |     | NULL    |       |
    | console      | text     | YES  |     | NULL    |       |
    | project_name | text     | YES  |     | NULL    |       |

    <details>
    <summary>mysqlでデータベースを作成するコマンドの例</summary>

        $ mysql --user=root --password

        mysql> CREATE DATABASE katacode;
        mysql> USE katacode;
        mysql> CREATE TABLE share_projects (id char(36), block_xml TEXT, code TEXT, console TEXT, project_name TEXT, PRIMARY KEY (id));
        mysql> CREATE USER katacodeuser@localhost IDENTIFIED BY 'password';
        mysql> GRANT ALL ON katacode.* TO katacodeuser@localhost;
        mysql> quit

    </details>
4. ```config.ini```にホスト名、ユーザー名、パスワード、データベース、テーブル名を設定します
5. サーバーを設定し公開します

