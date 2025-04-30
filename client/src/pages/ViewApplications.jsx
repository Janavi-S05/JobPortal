import React, { useContext, useEffect, useState } from 'react'
import { viewApplicationsPageData } from '../assets/assets'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import axios from 'axios'
const ViewApplications = () => {

    const { backendUrl, companyToken } = useContext(AppContext)

    const [applicants, setApplicants] = useState([])

    // function to fetch company job applications data
    const fetchCompanyJobApplications = async () => {
        try {
            const { data } = await axios.get(backendUrl + 'api/company/applicants',
                { headers: { token: companyToken } }
            )

            console.log(data)
            if (data.success) {
                setApplicants(data.applications.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }

    }

    // function to update job applications status
    const changeJobApplicationStatus = async (id, status) => {
        try {
            const { data } = await axios.post(backendUrl + 'api/company/change-status',
                { id, status },
                { headers: { token: companyToken } }
            )

            if (data.success) {
                fetchCompanyJobApplications()
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (companyToken) {
            fetchCompanyJobApplications()
        }
    }, [companyToken])

    return applicants ? applicants.length === 0 ? (
        <div className='flex items-center justify-center h-[70vh]'>
            <p className='text-xl sm:text-2xl'> No Applications available</p>
        </div>) : (
        <div className='container mx-auto p-4'>
            <div>
                <table className='w-full max-w-4l bg-white border border-gray-200 max-sm:text-sm'>
                    <thead>
                        <tr className='border-b border-gray-200'>
                            <th className='py-2 px-4 text-left'>#</th>
                            <th className='py-2 px-4 text-left'>Username</th>
                            <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
                            <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
                            <th className='py-2 px-4 text-left'>Resume</th>
                            <th className='py-2 px-4 text-left'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicants.filter(item => item.jobId && item.userId).map((applicant, index) => (
                            <tr key={index} className='text-gray-700 border-b border-gray-200'>
                                <td className='py-2 px-4 border-b border-gray-200 text-center'>{index + 1}</td>
                                <td className='py-2 px-4 border-b border-gray-200 text-left'>
                                    <div className='flex items-center gap-3'>
                                        <img className='w-10 h-10 rounded-full object-cover mr-3 max-sm:hidden' src={applicant.userId.image} alt="" />
                                        <span>{applicant.userId.name}</span>
                                    </div>
                                </td>
                                <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{applicant.jobId.title}</td>
                                <td className='py-2 px-4 border-b border-gray-200 max-sm:hidden'>{applicant.jobId.location}</td>
                                <td className='py-2 px-4 border-b border-gray-200'>
                                    <a href={applicant.userId.resume} target='_blank' className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center'>
                                        Resume <img src={assets.resume_download_icon} alt="" />
                                    </a>
                                </td>
                                <td className='py-2 px-4 border-b border-gray-200 relative'>
                                    {applicant.status === "Pending"
                                        ?
                                        <div className='relative inline-block text-left group'>
                                            <button className='text-gray-500 action-button'>...</button>
                                            <div className='z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
                                                <button className='block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100' onClick={() => changeJobApplicationStatus(applicant._id, 'Accepted')}>Accept</button>
                                                <button className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100' onClick={() => changeJobApplicationStatus(applicant._id, 'Rejected')}>Reject</button>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            {applicant.status}
                                        </div>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    ) : <Loading />
}

export default ViewApplications