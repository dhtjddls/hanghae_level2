const express = require("express");
const router = express.Router();
const User = require("../schemas/user.js");


// 회원가입 API
router.post('signup', async (req, res) => {

    const {nickname, password, confirm} = req.body;

    try{
        // 닉네임 형식 검사
        let nicknameCheck = /^[a-zA-Z0-9]{3,}$/ // 최소 3자 이상, 알파벳 대소문자, 숫자로 구성
        if(!nicknameCheck){
            res.status(412).json({
                errorMessage: "닉네임의 형식이 일치하지 않습니다."
            });
            return;
        }

        // 패스워드 및 패스워드 확인
        if(password != confirm){
            res.status(412).json({
                errorMessage: "패스워드가 일치하지 않습니다."
            });
            return;
        }

        // 패스워드 형식 검사
        // 최소 4자 이상, 닉네임과 같은 값이 포함된 경우 회원가입에 실패
        if(password.length < 3){
            res.status(412).json({
                errorMessage: "패스워드가 형식이 일치하지 않습니다."
            });
            return;
        } else if(password.includes(nickname)){
            res.status(412).json({
                errorMessage: "패스워드에 닉네임이 포함되어 있습니다."
            });
            return;
        }

        // 닉네임 중복 확인
        const existsNick = await User.findOne({nickname});
        if(existsNick) {
            res.status(412).json({
                errorMessage: "중복된 닉네임입니다."
            });
            return;
        }
    }catch(err) {
        res.status(400).json({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다."
        });
        return;
    }

    const user = new User({nickname, password});
    await user.save();

    res.status(201).json({
        message: "회원 가입에 성공하였습니다."
    })
    
})