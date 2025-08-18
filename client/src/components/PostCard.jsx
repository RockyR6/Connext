import React, { useState } from 'react'
import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import api from '../api/axios'

const PostCard = ({ post }) => {
  const postWithHashtags = post.content.replace(
    /(#\w+)/g,
    '<span class="text-indigo-600 font-medium">$1</span>'
  )

  // Keep likes as array of user IDs
  const [likes, setLikes] = useState(post.likes || [])
  const currentUser = useSelector((state) => state.user.value)

  const { getToken } = useAuth()
  const navigate = useNavigate()

  const handleLike = async () => {
    try {
      const { data } = await api.post(
        '/api/post/like',
        { postId: post._id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )

      if (data.success) {
        toast.success(data.message)

        setLikes((prev) => {
          if (prev.includes(currentUser._id)) {
            // remove user from likes
            return prev.filter((id) => id !== currentUser._id)
          } else {
            // add user to likes
            return [...prev, currentUser._id]
          }
        })
      } else {
        toast.error(data.message || 'Failed to like')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 space-y-3 w-full max-w-2xl border border-gray-100 hover:shadow-md transition-all duration-200">
      {/* user info */}
      <div className="flex items-center space-x-3">
        <img
          src={post.user.profile_picture}
          alt=""
          className="w-8 h-8 rounded-full shadow-sm"
        />
        <div>
          <div
            onClick={() => navigate('/profile/' + post.user._id)}
            className="flex items-center space-x-1 cursor-pointer font-medium text-sm"
          >
            <span>{post.user.full_name}</span>
            <BadgeCheck className="w-3 h-3 text-blue-500" />
          </div>
          <div className="text-xs text-gray-500">
            @{post.user.username} • {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* content */}
      {post.content && (
        <div
          dangerouslySetInnerHTML={{ __html: postWithHashtags }}
          className="text-gray-800 text-sm whitespace-pre-line"
        />
      )}

      {/* images */}
      {post.image_urls.length > 0 && (
        <div className="space-y-3">
          {post.image_urls.map((img, index) => (
            <img
              src={img}
              key={index}
              className="w-full max-h-[600px] object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* actions */}
      <div className="flex items-center gap-5 text-gray-600 text-xs pt-2 border-t border-gray-200">
        <div className="flex items-center gap-1">
          <Heart
            onClick={handleLike}
            className={`w-4 h-4 cursor-pointer ${
              likes.includes(currentUser._id) ? 'text-red-500 fill-red-500' : ''
            }`}
          />
          <span>{likes.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span>{16}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4" />
          <span>{9}</span>
        </div>
      </div>
    </div>
  )
}

export default PostCard
