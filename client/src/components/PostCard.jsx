import React, { useState } from 'react'
import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import moment from 'moment'
import { dummyUserData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const PostCard = ({post}) => {

    const postWithHashtags = post.content.replace(/(#\w+)/g, '<span class="text-indigo-600">$1</span>')
    const [ likes, setLikes ] = useState(post.likes_count)
    const [ isLiked, setIsLiked ] = useState(false)
    const currentUser = dummyUserData

    const handleLike = async() => {

    }

    const navigate = useNavigate()

  return (
    <div className=' bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
        {/* user info */}
      <div className='flex items-center space-x-3'>
        <img src={post.user.profile_picture} alt="" className=' w-10 h-10 rounded-full shadow'/>
        <div>
          <div onClick={() => navigate('/profile/' + post.user._id)}
          className='flex items-center space-x-1 cursor-pointer'>
              <span>{post.user.full_name}</span>
              <BadgeCheck className=' w-4 h-4 text-blue-500'/>
          </div>
          <div className='text-sm text-gray-500'>
              @{post.user.username} • {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>
      
      {/* content */}
      {post.content && 
      <div dangerouslySetInnerHTML={{__html: postWithHashtags}}
      className=' text-gray-800 text-sm whitespace-pre-line'/>}

      {/* images */}
      <div>
        {post.image_urls.map((img, index)=> (
            <img src={img} key={index} className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`}/>
        ))}
      </div>

      {/* actions */}
      <div className=' flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
        <div className='flex items-center gap-1'>
            <Heart onClick={handleLike}
            className={`w-4 h-4 cursor-pointer ${isLiked && 'text-red-500 fill-red-500'}`}/>
            <span>{likes}</span>
        </div>
        <div className='flex items-center gap-1'>
            <MessageCircle className='w-4 h-4'/>
            <span>{16}</span>
        </div>
        <div className='flex items-center gap-1'>
            <Share2 className='w-4 h-4'/>
            <span>{9}</span>
        </div>
      </div>
    </div>
  )
}

export default PostCard