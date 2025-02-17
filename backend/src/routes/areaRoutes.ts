import { Hono } from 'hono'
import { getAreas, createArea, getAreaById, updateArea, deleteArea } from '../controllers/AreaController'

const areaRouter = new Hono()

areaRouter.get('/', getAreas)
areaRouter.post('/', createArea)
areaRouter.get('/:id', getAreaById)
areaRouter.patch('/:id', updateArea)
areaRouter.delete('/:id', deleteArea)

export { areaRouter as AreaRoutes }
