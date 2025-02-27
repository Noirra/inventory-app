import { Hono } from 'hono'
import { createUserItem, deleteUserItem, getAllUserItems, getUserItemById, updateUserItem} from '../controllers/UserItemController'

const userItemRouter = new Hono()

userItemRouter.post('/', createUserItem)
userItemRouter.get('/', getAllUserItems)
userItemRouter.get('/:id', getUserItemById)
userItemRouter.patch('/:id', updateUserItem)
userItemRouter.delete('/:id', deleteUserItem)

export { userItemRouter as userItemRoutes }
