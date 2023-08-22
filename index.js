const express = require('express');
const multer = require('multer'); 
const path = require('path');
const aws = require('aws-sdk'); //aws 설정을 위한 모듈
const multerS3 = require('multer-s3') //aws s3에 업로드하기 위한 multer설정
const app = express();
const PORT = 8000;

//aws설정
aws.config.update({
    accessKeyId: 'AKIARLHBYEW2ULUTQYEJ',
    secretAcessKey: "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",
    region: 'ap-northeast-2',
});
//aws s3 인스턴스 생성
const s3 = new aws.S3();

app.set('view engine', 'ejs'); 
app.use('/uploads', express.static(__dirname + '/uploads'));

// const storage = multer.diskStorage({
//     destination: (req,file, cb) => {
//         cb(null, 'uploads/')
//     },
//     filename: (req, file, cb) => {
//         file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
//         const ext = path.extname(file.originalname);
//         const newName = path.basename(file.originalname, ext) + Date.now() + ext;
//         cb(null, newName);
//     }
// });
// const limit = {
//     fileSize: 5 * 1024 * 1024
// };
// const upload = multer({storage, limit});

//multer설정 - aws
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'test-server-upload',
        acl: 'public-read', //파일 접근 권한 설정 (public-read로 해야 업로드된 파일이 공개된다.)
        metadata: function(req,file, cb) {
            cb(null, {fieldName: file.filename});
        },
        key: function(req, file, cb) {
            cb(null, Date.now().toString()+'-'+ file.originalname)
        }
    })
})

app.post('/dynamic', upload.array('dynamic'), (req,res) => {
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


