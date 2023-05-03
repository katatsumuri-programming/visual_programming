USE katacode;

CREATE TABLE IF NOT EXISTS share_projects
(
    id char(36),
    block_xml TEXT,
    code TEXT,
    console TEXT,
    project_name TEXT,
    PRIMARY KEY (id)
);

GRANT ALL ON katacode.* TO `katacodeuser`@`%`;