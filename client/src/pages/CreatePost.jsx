import React, { useState } from 'react'
import { Image, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'


const CreatePost = () => {
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const user = useSelector((state) =>state.user.value)

  const handleSubmit = async () => {
    // Don't set loading here - let toast.promise handle it
    
    // Your post creation logic here
    // Example:
    // const response = await createPost({ content, images })
    // return response
    
    // For now, simulate an API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Reset form after successful submission
    setContent('')
    setImages([])
    
    return "Post created successfully"
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Create post</h1>
          <p className='text-slate-600'>Share your thoughts with the world</p>
        </div>
        {/* form */}
        <div className='max-w-xl bg-white p-4 sm:pb-3 rounded-xl shadow-md space-y-4'>
          {/* header */}
          <div className='flex items-center gap-3'>
            <img src={user.profile_picture} alt="" className='w-12 h-12 rounded-full shadow'/>
            <div>
              <h2 className='font-semibold'>{user.full_name}</h2>
              <p className='text-sm text-gray-500'>@{user.username}</p>
            </div>
          </div>
          {/* text area */}
          <textarea onChange={(e)=>setContent(e.target.value)} value={content}
          className='w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder-gray-400' placeholder="What's happening"/>
          {/* images */}
          {
            images.length > 0 && <div className='flex flex-wrap gap-2 mt-4'>
              {images.map((image, i)=>(
                <div key={i} className='relative group'>
                  <img src={URL.createObjectURL(image)} alt="" className='h-20 rounded-md'/>
                  <div onClick={()=> setImages(images.filter((_, index)=> index !== i))}
                  className='absolute hidden group-hover:flex justify-center items-center top-0 right-0 left-0 bg-black/40 rounded-md cursor-pointer'>
                    <X className='w-6 h-6 text-white'/>
                  </div>
                </div>
              ))}
            </div>
          }

          {/* bottom bar */}
          <div className='flex text-center justify-between pt-3 border-t border-gray-300'>
            <label htmlFor="images" className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer'>
              <Image className='size-6'/>
            </label>
            <input type="file" id='images' accept='image/*' hidden multiple onChange={(e)=>setImages([...images, ...Array.from(e.target.files)])}/>

            <button disabled={isSubmitting || (!content.trim() && images.length === 0)} onClick={async ()=> {
              if (isSubmitting) return
              
              setIsSubmitting(true)
              try {
                await toast.promise(
                  handleSubmit(),
                  {
                    loading:'Uploading...',
                    success: 'Post Added Successfully!',
                    error: 'Failed to create post',
                  }
                )
              } catch (error) {
                console.error('Post creation failed:', error)
              } finally {
                setIsSubmitting(false)
              }
            }}
            className='text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white font-medium px-8 py-2 rounded-md cursor-pointer'>
              Publish post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost