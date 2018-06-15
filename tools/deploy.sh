gulp build

aws s3 sync dist s3://examples.omnigage.io/terminal-example/ --delete
