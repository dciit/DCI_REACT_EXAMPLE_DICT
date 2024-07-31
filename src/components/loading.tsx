import  { useEffect } from 'react'
import { useCacheBuster } from 'react-cache-buster';

function Loading() {
    const { checkCacheStatus } = useCacheBuster();
    useEffect(() => {
        console.log(checkCacheStatus)
    },[checkCacheStatus])
    return (
        <div>
            <p>Loading ...</p>
            <button onClick={checkCacheStatus}>Check for new version</button>;
        </div>
    )
}

export default Loading