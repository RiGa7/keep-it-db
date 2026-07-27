import { AnimatePresence, motion } from "framer-motion";

export default function MobileProfileMenu({

    open,
    onClose,
    user,
    logout

}) {

    return (

        <AnimatePresence>

            {open && (

                <>
                    <motion.div

                        onClick={onClose}

                        initial={{ opacity: 0 }}
                        animate={{ opacity: .5 }}
                        exit={{ opacity: 0 }}

                        className="fixed inset-0 bg-black z-40"

                    />

                    <motion.div

                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}

                        className="fixed top-20 right-4 bg-primary border border-secondary rounded-xl w-64 p-4 z-50"

                    >

                        <div className="flex flex-col">

                            <span className="font-bold text-white">
                                {user?.name}
                            </span>

                            <span className="text-sm text-gray-400">
                                {user?.email}
                            </span>

                        </div>

                        <button

                            onClick={logout}

                            className="mt-4 w-full rounded-lg bg-danger text-white py-2"

                        >
                            Sign Out
                        </button>

                    </motion.div>

                </>

            )}

        </AnimatePresence>

    );

}