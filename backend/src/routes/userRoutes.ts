import { Hono } from 'hono'
import {
    getUsers,
    registerUser,
    getUserById,
    updateUser,
    deleteUser,
    makeUserAdmin,
    makeUserEmployee
} from '../controllers/UserController'

const userRouter = new Hono()

userRouter.get('/', getUsers)
userRouter.post('/', registerUser)
userRouter.get('/:id', getUserById)
userRouter.patch('/:id', updateUser)
userRouter.patch('/:id/admin', makeUserAdmin)
userRouter.patch('/:id/employee', makeUserEmployee)
userRouter.delete('/:id', deleteUser)

export { userRouter as UserRoutes }
