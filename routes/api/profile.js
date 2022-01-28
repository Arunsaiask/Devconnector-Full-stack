const express = require("express");
const mongoose = require("mongoose")
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Post = require("../../models/Posts")
const config = require("config");
const request = require("request");
const Profile = require("../../models/Profile");
const router = express.Router();

const { validationResult, check } = require("express-validator");

//route GET api/profile/me
//@description get users profile who is logged in
//access auth req/private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "no profile found for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ msg: "server error" });
  }
});

//route GET api/profile
//@description create or update profile
//access auth req/private

router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required").not().isEmpty(),
      check("skills", "skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      skills,
      githubusername,
      youtube,
      facebook,
      instagram,
      twitter,
      linkedin,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (bio) profileFields.bio = bio;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    profileFields.social = {};
    if (instagram) profileFields.social.instagram = instagram;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (youtube) profileFields.social.youtube = youtube;

    try {
      //if profile exists update
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //else create profile
      profile = new Profile(profileFields);

      await profile.save();

      res.json(profile);
    } catch (err) {
      res.status(400).json({ msg: "server error" });
    }
  }
);

//route GET api/profile
//@description gets all profiles
//access public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//route GET api/profile/user/:user_id
//@description gets profile by id and we should pass id
//access public

router.get("/user/:user_id",async(req,res)=>{
try{
  const profile = await Profile.findOne({user:req.params.user_id}).populate("user", ["name", "avatar"]);
 
  if(!profile) res.status(500).json({msg:"profile not found"})
  res.json(profile)
}catch (error) {
  console.error(error.message);

  // Check if the ID is valid
  const valid = mongoose.Types.ObjectId.isValid(req.params.user_id);
  if (!valid) {
    return res.status(400).json({ msg: 'Profile not found' });
  }

  res.status(500).send('Server error');
}
})

//route GET api/profile
//@description delete profile and user 
//access private

router.delete("/",auth,async(req,res)=>{

  try{
    //remove posts
   await Post.deleteMany({user:req.user.id})
   //remove profile
   await Profile.findOneAndRemove({user:req.user.id}) 
   //remove user from db
   await User.findOneAndRemove({_id:req.user.id})
   res.json({msg:"User is deleted"})
  }catch(err){
    console.err(err.message)
    res.status(500).send("server error");

  }
 
})

//route put api/profile/experience
//@description update profile experience
//access private

router.put("/experience",[auth,[
  check("title","title is require").not().isEmpty(),
  check("company","company is require").not().isEmpty(),
  check("from","from date is require").not().isEmpty()
]],async(req,res)=>{
   // Finds the validation errors in this request and wraps them in an object with handy functions
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
   }
   const {
     title,company,location,from,to,current,description,
   } = req.body;

   const newExp = {
     title,company,location,from,to ,current,description
   }
   try{
     const profile = await Profile.findOne({user:req.user.id})
     profile.experience.unshift(newExp);
      await profile.save()
     res.json(profile)
   }catch(err){
     console.error(err.message)
     res.status(500).send("server error")
   }
})

//route GET api/profile/experience/:exp_id
//@description delete experience
//access private

router.delete("/experience/:exp_id",auth,async(req,res)=>{

  try{
    const profile =  await Profile.findOne({user:req.user.id})
    //not that much accurate
    //get index by map through experience and find index of exp_id
    // const removeIndex =  profile.experience.map(item=>item.id).indexOf(req.params.exp_id)
    // ///remove the experience by use of index 
    // profile.experience.splice(removeIndex,1)

    if(profile.experience){
      profile.experience = profile.experience.filter(profileExp=>
         profileExp._id.toString() !== req.params.exp_id.toString()   )
    }
    await profile.save()

    res.json(profile);
  }catch(err){
    console.error(err.message)
    res.status(500).send("server error");

  }
 
})

//route put api/profile/education
//@description update profile education
//access private

router.put("/education",[auth,[
  check("school","school is required").not().isEmpty(),
  check("degree","degree is required").not().isEmpty(),
  check("fieldofstudy","fieldofstudy is required").not().isEmpty(),
  check("from","from date is required").not().isEmpty(),
]],async(req,res)=>{
// Finds the validation errors in this request and wraps them in an object with handy functions
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}

const {
  school,
  degree,
  fieldofstudy,
  from,
  to,
  current,
  description
} =req.body;

const newEdu = {
  school,degree,fieldofstudy,from,to,current,description
}
try{
  // find profile 
  const profile = await Profile.findOne({user:req.user.id})
  profile.education.unshift(newEdu);
  await profile.save()
  res.json(profile);

}catch(err){
  console.error(err.message)
  res.status(500).send("Server error")
}
});


//route delete api/profile/education/:edu_id
//@description delete profile education
//access private


router.delete("/education/:edu_id",auth,async(req,res)=>{
try{
  const profile = await Profile.findOne({user:req.user.id})
  //here we filter only objects that other than passed id
  if (profile.education) {
    profile.education = profile.education.filter(
      profileEdu => profileEdu._id.toString() !== req.params.edu_id.toString()
    );
  }
  await profile.save();
  res.json(profile)
}catch(err){
  console.error(err.message);
  res.status(500).send("server error")
}
})



//route GET api/profile/github/:githubusername
//@description gets repos of user 
//access public


router.get("/github/:username",(req,res)=>{
try{
  const options = {
    uri:encodeURI( `https://api.github.com/users/${
      req.params.username
    }/repos?per_page=5&sort=created:asc&client_id=${config.get(
      'githubClientID')}&client_secret=${config.get('githubSecret')}`),
    method: 'GET',
    headers: { 'user-agent': 'node.js' }
  };
  request(options, (error, response, body) => {
    if (error) console.error(error);

    if (response.statusCode !== 200) {
      return res.status(404).json({ msg: 'No Github profile found' });
    }

    res.json(JSON.parse(body));
  });
}catch(err){
 console.error(err.message);
 res.status(5000).send({msg:"server error"})
}
})










module.exports = router;
