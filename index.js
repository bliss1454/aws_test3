const express = require('express');
const multer = require('multer'); 
const aws = require('aws-sdk'); //aws 설정을 위한 모듈
const multerS3 = require('multer-s3') //aws s3에 업로드하기 위한 multer설정
const app = express();
const PORT = 8000;

app.set('view engine', 'ejs'); 
//aws설정
aws.config.update({
    accessKeyId: 'AKIARLHBYEW27NW235QL',
    secretAccessKey: "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",
    region: 'ap-northeast-2',
});
//aws s3 인스턴스 생성
const s3 = new aws.S3();

//multer설정 - aws
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'test-server-file',
        acl: 'public-read', //파일 접근 권한 설정 (public-read로 해야 업로드된 파일이 공개된다.)
        metadata: function(req,files, cb) {
            cb(null, {fieldName: files.fieldname});
        },
        key: function(req, file, cb) {
            cb(null, Date.now().toString()+'-'+ file.originalname)
        }
    })
})

app.post('/upload',upload.array('files'),(req,res) => {
    console.log(req.files);
    res.send(req.files);
});

app.get('/', (req, res) => {
    res.render('index');
});

app.use('*', (req,res) => {
    res.render('404');
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});


