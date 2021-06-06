 # Git Commit

 ## Start Git
 ```
 git init
 ```

 ##  添加remote点

```
git remote add origin <自己的repo地址，https的那个>
```

如果需要移除remote点，或者遇到not file directory的情况，我们就最好remove 了  remote点，再重新加上

 ## 添加commit

 ```
 git add -A
 git commit -m "commit info" 
 ```


## push到repo
```
git push origin master
```

## 管理 NPM
## create package.json

```
npm init
```

# 配置testing

## install Jasmine

 ``` 
 npm install -D jasmine
 ```

## 初始化jasmine
```
npx jasmine init
```

## 更新package.json

```json
{
    ...
    "scripts":{
        "test": "jasmine"
    },
}
```

## 运行测试

```
npm test
```

