var cfg_key = {
    //服务器通信
    publickey:'-----BEGIN PUBLIC KEY-----\n'+
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC78lzeIEcp5c0WscKqaOY7c0NV\n'+
    'x3wEtGnemmNlvcit7phNF3X/I+wxDrL9G83RuxU3iv9dEPaW1Bf6fLuI+V0AxjVy\n'+
    'wjF3dOlDZrkQbLXGbWg43Ty8VmWyl9iKJ+xibnUkum/1RZ3lcTg/rebuYybenyvu\n'+
    '7XuNcqZUdobGfJ/X7QIDAQAB\n'+
    '-----END PUBLIC KEY-----',

    prikey:'-----BEGIN RSA PRIVATE KEY-----\n'+
    'MIICXQIBAAKBgQDblOSZk8Krw8vk0kkALzY/jC20lCE86YF3Kx2G7unZajUBYAke\n'+
    'B9jc6Ygz7luAjTlIP0WOMCnBuBmblzqB5R3yrIuyO3cT9blMlXOPaKLDWCr08fYJ\n'+
    '2C6USO4YxhNG91EP6tGcy6U3znmE50WVa558GupIruIHc10doH4GqGy2LQIDAQAB\n'+
    'AoGATEHhQhS2vsA4xzbgc1fyFw+vr87h3C2b8K7gikPeosrnrZqUkAFZpx7TVnWp\n'+
    'AXQKOLUAiujfF4/AFPDoOMRBKalTsHUjtmSwiaSEM3AWIW4piNSHOKCGLxqsXVPi\n'+
    'Gb5A/9Sl2d8LIq9g4xkc3hxObiLscWpRYblZafj2vVXzLAECQQDz7MlAwAX/0Vsf\n'+
    'fxe/lptC3i9Socie3brw1gB64J8D9rqe9r+hnhJgKcJLKZXbies4VGc1Umqo3fYC\n'+
    'onhE1xWhAkEA5nObw95tVmEUDBHkZp9w1Ki+zjWaTzHmM7PDtR0WQ9s1piIli4M2\n'+
    'aMhPDMSLStUw287KdApknHr6azCEzFF9DQJALp79QEDzZJexIO37rgStHDS3OsXt\n'+
    'QGAE0O82HEY+XlWUCboDmnJJ9NNGbXM/TzynFpcbOtfLxwbVdF91OUMawQJBANOk\n'+
    'gP1VnVyjM2ISXIzTCTCE+Rcwq1LoJN5+zdHbsMMI4zB8U7bY/nMk41R6fOJxALoe\n'+
    'JFiF4vjDCJDAsnVisVECQQCLDPf2Eq5xVMciadGeEBXX65j8nIQmiLc/3oo+n3fj\n'+
    '8O0OF7cVTU1mFGTSAlQ4wVfwWTxl2GWPHKjJVyA8FN3o\n'+
    '-----END RSA PRIVATE KEY-----',
    //后台通信 
    publickey1: '-----BEGIN PUBLIC KEY-----\n'+
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCf9I2Zm5gOt+0S+msOATBZASVH\n'+
    'HOtDwHicRdLnHaErfcghL23rVp3bh4TZk3jw8hiU+HSoKNWj5fTXGnOaX9G6+B1q\n'+
    'OTbDltZRZYt4wuiLR0TDVIDuiP8aor2na+EV8RBaReyXrLrcgsNdPgzlqmDsMoWV\n'+
    'zpbUhL3gV4O5JEa1uQIDAQAB\n'+
    '-----END PUBLIC KEY-----',
    prikey1: '-----BEGIN RSA PRIVATE KEY-----\n'+
    'MIICWwIBAAKBgQCf9I2Zm5gOt+0S+msOATBZASVHHOtDwHicRdLnHaErfcghL23r\n'+
    'Vp3bh4TZk3jw8hiU+HSoKNWj5fTXGnOaX9G6+B1qOTbDltZRZYt4wuiLR0TDVIDu\n'+
    'iP8aor2na+EV8RBaReyXrLrcgsNdPgzlqmDsMoWVzpbUhL3gV4O5JEa1uQIDAQAB\n'+
    'AoGAeigH4+Gh9MueMDoye9WImNB5KZ/6RBm/gokIkhxcs5wxtLZGGc5ia/9JA+jO\n'+
    'GiSphUthu/LDhZHetE+tLZ4zyoMKXEAQNwg+DdRieNeNPhvmLKIr6xYKBvWkJvno\n'+
    'BB1hjnSFhEdrCPKopXQS1y8XWh7HH317y0ZhDOGyzLCNlQECQQDM/Gvd0zdDO7gL\n'+
    '0m+UsX3qJ7aOJJeZai/7MRPqDPkByPtSAk9EcBOsJlRAuLu1XbQ0cfeDLhuumcmP\n'+
    'u2YJg14pAkEAx8M9yiTqeAQuHAvEmZtTfkGo1qTHx9qThN1RDeO2m//6agnZCpSp\n'+
    'fFPZy8OXISlZXx6/OJmlqj5NKxMFOoZtEQJADWSov5OfVrs+KTeUpsh6C6SQnvTx\n'+
    'Gsr/W5A3VuGGG4HAOfmAqF4SSvsuIhRv30fCEHMp0t5eXKgbrVJ3NkPpEQJAdK/d\n'+
    'hhjuRVDbxlIxczDCIrwj7c2vTVSmWzQURrK/Vny+P/akq4OPRSqNzHLh8uL+a4vA\n'+
    'U0Wc+ccOuJyRr1AaoQJAIyDxGlg8RYUs1ggET2pevWwa+3Bpwjn07pCh0y5UI6AR\n'+
    'ruJ9p9N6FGHngZY/RrEmtTnEJdbGzz4uRCMI8QLXwg==\n'+
    '-----END RSA PRIVATE KEY-----',
    // 用于线上支付链接参数加密AES加密
    onlinePaypriKey:"V1tBeml7KOHQLKMg"
}
export default cfg_key;
