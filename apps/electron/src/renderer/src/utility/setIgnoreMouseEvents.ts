import { nodeApi } from '@web/api/nodeApi'
import { useApi } from '@web/api/useApi'

export function setIgnoreMouseEvents(ignore: boolean) {
	const request = useApi('ignoreMouse', nodeApi.setIgnoreMouseEvents)
	request.exec(ignore)
}
