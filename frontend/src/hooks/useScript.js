import { useEffect } from 'react'

const useScript = (url, id) => {
    useEffect(() => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = url
        script.id = id
        script.async = true

        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }
    }, [url])
}

export default useScript