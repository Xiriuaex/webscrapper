'use client'

import { FormEvent, Fragment, useState } from 'react';
import { Dialog, Transition, TransitionChildProps } from '@headlessui/react';
import Image from 'next/image';
import { addUserEmailToProduct } from '@/lib/actions';

interface Props {
    productId: string,
}
const Modal = ({productId}: Props ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addUserEmailToProduct(productId, email);
            setEmail('');
            closeModal();
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

  return (
    <>
        <button type="button" className="btn" onClick={openModal}>
            Track
        </button>

        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as='div' onClose={closeModal} className="dialog-container">
                <Dialog.Panel>
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom='opacity-0'
                            enterTo='opacity-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                        >
                            <Dialog.Overlay className="fixed inset-0"/>
                        </Transition.Child>

                        {/* span tag is to center  */}
                        <span
                        className='inline-block h-screen align-middle'
                        aria-hidden='true'
                        />

                        <Transition.Child
                            as={Fragment}
                            enter='eae-out duration-300'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'
                        >
                            <div className="dialog-content">
                                <div className="dialog-content">
                                    <div className="flex flex-col">
                                        <div className="flex justify-between">
                                            <div className="p-3 border border-gray-200 rounded-10">
                                                <Image
                                                    src="/assets/icons/priceTag.svg"
                                                    alt="price-tag"
                                                    width={28}
                                                    height={28}
                                                />
                                            </div>

                                            <Image
                                                src="/assets/icons/close.svg"
                                                alt="close"
                                                width={26}
                                                height={26}
                                                className='cursor-pointer'
                                                onClick={closeModal}
                                            />
                                        </div>

                                        <h4>Stay updated with product pricing alerts right in your inbox!</h4>
                                    </div>

                                    <form className='flex flex-col mt-5' onSubmit={handleSubmit}>
                                        <label htmlFor="email" className='text-sm font-medium text-gray-700'>
                                            Email Address
                                        </label>

                                        <div className="dialog-input_container">
                                            <Image
                                                src={"/assets/icons/email.svg"}
                                                alt='mail'
                                                width={18}
                                                height={18}
                                            />

                                            <input 
                                                type="email"
                                                required 
                                                id='email'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder='Enter your email address'
                                                className='dialog-input'
                                            />
                                        </div>

                                        <button className='dialog-btn' type='submit'>
                                            {isSubmitting ? 'Submitting...' : 'Track'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </Transition>
    </>
  )
}

export default Modal
