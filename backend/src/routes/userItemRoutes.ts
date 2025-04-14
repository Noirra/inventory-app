import { Hono } from 'hono'
import {
    createUserItem,
    deleteUserItem,
    getUserItemsByUserId,
    updateUserItem,
    getUnusedItems,
} from '../controllers/UserItemController'

const userItemRouter = new Hono()

userItemRouter.post('/', createUserItem)
userItemRouter.get('/user/:userId', getUserItemsByUserId)
userItemRouter.patch('/:id', updateUserItem)
userItemRouter.delete('/:id', deleteUserItem)
userItemRouter.get('/get-unused', getUnusedItems)

export { userItemRouter as userItemRoutes }
