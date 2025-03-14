import { Hono } from 'hono'
import {
    createUserItem,
    deleteUserItem,
    getUserItemById,
    getUserItemsByUserId,
    updateUserItem
} from '../controllers/UserItemController'

const userItemRouter = new Hono()

userItemRouter.post('/', createUserItem)
userItemRouter.get('/user/:userId', getUserItemsByUserId)
userItemRouter.get('/:id', getUserItemById)
userItemRouter.patch('/:id', updateUserItem)
userItemRouter.delete('/:id', deleteUserItem)

export { userItemRouter as userItemRoutes }