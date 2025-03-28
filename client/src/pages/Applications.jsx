import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { assets, jobsApplied } from '../assets/assets'
import moment from 'moment'
import Footer from '../components/Footer'

const Applications = () => {

  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)

  return (
    <>
      <Navbar />
      <div className='container px-16 min-h-[65vh] 2xl:px-20 mx-auto my-10 '>
        <h2 className='text-xl font-semibold'>Your Resume</h2>

        <div className='flex gap-2 mb-6 mt-3'>
          {isEdit ? (
            <>
              <label className='flex items-center' htmlFor="resumeUpload">
                <p className='bg-teal-100 text-teal-600 px-4 py-2 rounded-lg mr-2'>Select Resume</p>
                <input
                  id='resumeUpload'
                  onChange={(e) => setResume(e.target.files[0])}
                  accept='application/pdf'
                  type="file"
                  hidden
                />
                <img src={assets.profile_upload_icon} alt="Upload Icon" />
              </label>

              <button onClick={() => setIsEdit(false)} className='bg-gray-100 border border-teal-400 rounded-lg px-4 py-2 text-teal-700'>
                Save
              </button>
            </>
          ) : (
            <div className='flex gap-2'>
              <a href="" className="bg-teal-100 text-teal-600 px-4 py-2 rounded-lg">
                Resume
              </a>
              <button onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'>
                Edit
              </button>
            </div>
          )}
        </div>

        <h2 className='text-xl font-semibold mb-4'>Jobs Applied</h2>
        <table className='min-w-full bg-white border border-gray-300 rounded-lg'>
  <thead>
    <tr>
      <th className='py-3 px-4 border-b border-gray-300 text-left'>Company</th>
      <th className='py-3 px-4 border-b border-gray-300 text-left'>Job Title</th>
      <th className='py-3 px-4 border-b border-gray-300 text-left hidden sm:table-cell'>Location</th>
      <th className='py-3 px-4 border-b border-gray-300 text-left hidden sm:table-cell'>Date</th>
      <th className='py-3 px-4 border-b border-gray-300 text-left'>Status</th>
    </tr>
  </thead>
  <tbody>
    {jobsApplied.map((job, index) => (
      <tr key={job._id || index} className="border-b border-gray-300">
        <td className='py-4 px-4 flex items-center gap-2'>
          {job.logo && <img className='w-8 h-8' src={job.logo} alt="Company Logo" />}
          {job.company}
        </td>
        <td className='py-4 px-4'>{job.title}</td>
        <td className='py-4 px-4 hidden sm:table-cell'>{job.location}</td>
        <td className='py-4 px-4 hidden sm:table-cell'>
          {job.date ? moment(job.date).format('ll') : 'N/A'}
        </td>
        <td className='py-4 px-4'>
          <span className={`${job.status === 'Accepted' ? 'bg-green-100' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'} px-4 py-1.5 rounded`}>
            {job.status}
          </span>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      <Footer />
    </>
  )
}

export default Applications