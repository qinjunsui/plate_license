 # Git Commit

 ## Start Git
 ```
 git init
 ```

 ##  添加remote点

```
git remote add origin <自己的repo地址，https的那个>
```

如果需要移除remote点，或者遇到not file directory的情况，我们就最好remove了remote点，再重新加上

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

## 将所有测试放到一个test文件夹下面
```
jasmine-node test
```
会运行所有在test文件夹下面的测试

## 将每一个测试的细节都打印出来

```
jasmine-node test --verbose 
```

## 将所有的test coverage打印出来

```
npc jasmine-node test --verbose
```

## recover Github
```
git reset --hard
```