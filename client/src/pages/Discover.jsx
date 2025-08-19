// import React, { useState, useEffect } from 'react'
// import { Search } from 'lucide-react'
// import { useAuth } from '@clerk/clerk-react'
// import { useDispatch } from 'react-redux'
// import toast from 'react-hot-toast'

// import UserCard from '../components/UserCard'
// import Loading from '../components/Loading'
// import api from '../api/axios'
// import { fetchUser } from '../features/user/userSlice'

// const Discover = () => {
//   const dispatch = useDispatch()
//   const [input, setInput] = useState('')
//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(false)
//   const { getToken } = useAuth()

//   const handleSearch = async (e) => {
//     if (e.key === 'Enter') {
//       try {
//         setUsers([])
//         setLoading(true)
//         const { data } = await api.post(
//           '/api/user/discover',
//           { input },
//           {
//             headers: { Authorization: `Bearer ${await getToken()}` },
//           }
//         )

//         if (data.success) {
//           setUsers(Array.isArray(data.users) ? data.users : [])
//         } else {
//           toast.error(data.message || 'Something went wrong')
//           setUsers([])
//         }

//         setInput('')
//       } catch (error) {
//         toast.error(error.message)
//         setUsers([])
//       }
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     getToken().then((token) => {
//       dispatch(fetchUser(token))
//     })
//   }, [dispatch, getToken])

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
//       <div className="max-w-6xl mx-auto p-6">
//         {/* title */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-slate-900 mb-2">
//             Discover People
//           </h1>
//           <p className="text-slate-600">
//             Connect with amazing people and grow your network
//           </p>
//         </div>

//         {/* search */}
//         <div className="mb-8 shadow-md rounded-md border-slate-200/60 bg-white/80">
//           <div className="p-6">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//               <input
//                 onChange={(e) => setInput(e.target.value)}
//                 value={input}
//                 onKeyUp={handleSearch}
//                 type="text"
//                 placeholder="Search people by name, username, bio, or location..."
//                 className="pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-6">
//           {Array.isArray(users) &&
//             users.map((user) => <UserCard user={user} key={user._id} />)}
//         </div>

//         {loading && <Loading height="60vh" />}
//       </div>
//     </div>
//   )
// }

// export default Discover

import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'

import UserCard from '../components/UserCard'
import Loading from '../components/Loading'
import api from '../api/axios'
import { fetchUser } from '../features/user/userSlice'

const Discover = () => {
  const dispatch = useDispatch()
  const [input, setInput] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false) // track if search was made
  const { getToken } = useAuth()

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        setUsers([])
        setLoading(true)
        setSearched(true)

        const { data } = await api.post(
          '/api/user/discover',
          { input },
          {
            headers: { Authorization: `Bearer ${await getToken()}` },
          }
        )

        if (data.success) {
          setUsers(Array.isArray(data.users) ? data.users : [])
        } else {
          toast.error(data.message || 'Something went wrong')
          setUsers([])
        }

        setInput('')
      } catch (error) {
        toast.error(error.message)
        setUsers([])
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchUser(token))
    })
  }, [dispatch, getToken])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Discover People
          </h1>
          <p className="text-slate-600">
            Connect with amazing people and grow your network
          </p>
        </div>

        {/* search */}
        <div className="mb-8 shadow-md rounded-md border-slate-200/60 bg-white/80">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyUp={handleSearch}
                type="text"
                placeholder="Search people by name, username, bio, or location..."
                className="pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* results */}
        <div className="flex flex-wrap gap-6">
          {Array.isArray(users) &&
            users.map((user) => <UserCard user={user} key={user._id} />)}
        </div>

        {/* no results */}
        {!loading && searched && users.length === 0 && (
          <p className="text-center text-slate-500 mt-10 w-full">
            No users found
          </p>
        )}

        {loading && <Loading height="60vh" />}
      </div>
    </div>
  )
}

export default Discover
