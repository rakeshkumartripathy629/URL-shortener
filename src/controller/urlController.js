const urlId = require('short-id')
const urlModel = require('../model/urlModel')
const axios = require('axios')
const redis = require("../redis/redis")
 
//-----------------------------URL Shorting------------------------------//

const urlShorter = async function (req, res) {
    try {
        let origUrl = req.body.longUrl;
        
        if (!origUrl) {
            return res.status(400).send({ status: false, message: "please Enter original URL in body" })
        }

        let option = {
            method: 'get',
            url: origUrl
        }
        let exist = await axios(option)
            .then(() => origUrl) // Pending and Fulfilled Promise Handling
            .catch(() => null); // Reject Promise Handling
    
        if(!exist) return res.status(400).send({status: false, message : "given URL doesn't exist"})

        let isPresent = await urlModel.findOne({ longUrl: origUrl }).select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 })
        if (isPresent) {
            return res.status(200).send({ status: true, message: "short URL is already generated with requested URL", data: isPresent }) // doubt with status code and status 400/200  and msg as well
        }

        let baseUrl = "http://localhost:3000/"
        let urlCode = urlId.generate().toLowerCase()
        let reqUrl = baseUrl + urlCode

        obj = {
            longUrl: origUrl,
            shortUrl: reqUrl,
            urlCode: urlCode
        }

        let urlDetails = await urlModel.create(obj)
        return res.status(201).send({ status: true, data: obj })
    } catch (err) {
        return res.status(500).send({ satus: false, messege: err.message })
    }
}

//-------------------------------------Redirecting to Another URL-------------------------------//



  
let redirectUrl = async function (req, res) {
    try {
        let urlCode = req.params.urlCode
        
        if(urlCode == ":urlCode")
        return res.status(400).send({status: false, message: "please enter urlCode in Params"})


        if(/.*[A-Z].*/.test(urlCode)){
            return res.status(400).send({ status: false, message: "please Enter urlCode only in lowercase " })

        }

        if(!/^[a-z0-9]{6,14}$/.test(urlCode)){
            return res.status(400).send({ status: false, message: "please Enter valid urlCode! " })

        }


        let cachedurlData = await redis.GET_ASYNC(`${req.params.urlCode}`)
      
        cachedurlData= JSON.parse(cachedurlData)
      
        if(cachedurlData) {
            return res.status(302).redirect(cachedurlData.longUrl)
        } else  {

            let origUrl = await urlModel.findOne({ urlCode:urlCode }).select({_id:0, longUrl:1});
            if (!origUrl) {
                return res.status(404).send({ status: false, message: "url not found with this UrlCode!" })
            }
            
          await redis.SET_ASYNC(`${req.params.urlCode}`,24*60*60, JSON.stringify(origUrl))
          return res.status(302).redirect(origUrl.longUrl);
        }
        
      

    } catch (err) {
        console.log(err)
        return res.status(500).send({ satus: false, messege: err.message })
    }

}


module.exports = {
    urlShorter,
    redirectUrl
}