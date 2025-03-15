import { Hono } from 'hono'
import {
    createUserItem,
    deleteUserItem,
    getUserItemsByUserId,
    updateUserItem
} from '../controllers/UserItemController'

const userItemRouter = new Hono()

userItemRouter.post('/', createUserItem)
userItemRouter.get('/user/:userId', getUserItemsByUserId)
userItemRouter.patch('/:id', updateUserItem)
userItemRouter.delete('/:id', deleteUserItem)

export { userItemRouter as userItemRoutes }
