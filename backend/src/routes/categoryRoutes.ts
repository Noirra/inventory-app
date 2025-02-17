import { Hono } from 'hono'
import { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory } from '../controllers/CategoryController'

const categoryRouter = new Hono()

categoryRouter.get('/', getCategories)
categoryRouter.post('/', createCategory)
categoryRouter.get('/:id', getCategoryById)
categoryRouter.patch('/:id', updateCategory)
categoryRouter.delete('/:id', deleteCategory)

export { categoryRouter as CategoriesRoutes }
