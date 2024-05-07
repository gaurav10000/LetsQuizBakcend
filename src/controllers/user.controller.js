import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinaryFileUpload.js'
import { ApiResponse } from '../utils/apiResponse.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';



const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // saving refresh token to database
        user.refreshToken = refreshToken
        user.save({
            validateBeforeSave: false
        })


        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}


const registerUser = asyncHandler(async(req, res) => {
    const {fullname, email, username, password} = req.body


    if ([fullname, email, username, password].some((field) => field?.trim === "")) {
        throw new ApiError(400, "All fields are required!")
    }

    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if (existingUser) {
        throw new ApiError(409, "User with same email or username already exists!")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?req.files.coverImage[0].path:"";

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required!")
    }

    const avatarUploadResponse = await uploadOnCloudinary(avatarLocalPath)
    // const coveImageUploadResponse = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatarUploadResponse.url) {
        throw new ApiError(400, "Avatar file is required!")
    }
    const user = await User.create({
        fullname,
        avatar: avatarUploadResponse.url,
        // coverImage: coveImageUploadResponse?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user!")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully!")
    )
})

const loginUser = asyncHandler(async(req, res) => {
    const {username, password} = req.body

    if (!username && !password) {
        throw new ApiError(400, "Both username and passowrd are required!")
    }
    
    const user = await User.findOne({username})
    
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(typeof password != "string"? `${password}` : password )

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password is credentials!")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    user.refreshToken = refreshToken

    const options = {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: 'none',
    }
    
    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        avatar: user.avatar,
                        fullname: user.fullname
                    },
                    accessToken: accessToken,
                    refreshToken: refreshToken
                },
                "User logged in successfully!"
                )
        )
})

const logoutUser = asyncHandler(async(req, res) => {
    await  User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: 'none',
    }

    return res.status(200)
              .clearCookie("accessToken", options)
              .clearCookie("refreshToken", options)
              .json(new ApiResponse(200, {}, "User logged out!"))
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized Request!")
        }
    
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token!")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used!")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)
    
        return res.status(200)
                  .cookie("accesstoken", accessToken)
                  .cookie("refresh", newRefreshToken)
                  .json(new ApiResponse(
                    200,
                    {accessToken, newRefreshToken},
                    "Access token refreshed"
                  ))

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const updateUser = asyncHandler(async(req, res) => {
    const {fullname, email, username, password} = req.body

    const user = await User.findById(req.user._id)

    
    if (!user) {
        throw new ApiError(404, "User not found!")
    }
    
    // check if changed username already exists? also for email

    if (user.username != username) {
        const existingUser = await User.findOne({username}).select("-password -refreshToken")
        if (existingUser) {
            throw new ApiError(409, "User with same username found! Please use some different username.")
        }
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, {
        fullname: fullname,
        email: email,
        username: username,
        password: password != "NoChange" ? bcrypt.hashSync(password, 10) : user.password
    }, {
        new: true,
    })


    if (!updatedUser) {
        throw new ApiError(500, "Something went wrong while updating user!")                      
    }

    res.status(200).json(
        new ApiResponse(200, updatedUser, "User updated successfully!")
    )

})

const userDetails = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not find!")
    }
    res.status(200).json(
        new ApiResponse(200, user, "User found!")
    )
})

const isLoggedIn = asyncHandler(async(req, res) => {
    const user = req.user
    if (!user) {
        throw new ApiError(401, "User is not logged in.")
    }

    res.status(200).json(new ApiResponse(200, {}, "User is already logged in."))
})

export {
    registerUser,
    loginUser,  
    logoutUser,
    refreshAccessToken,
    userDetails,
    updateUser,
    isLoggedIn
}