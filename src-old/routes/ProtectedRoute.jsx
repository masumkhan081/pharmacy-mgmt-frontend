import React from 'react'

export default function ProtectedRoute({ children, pass }) {

    if (pass) {
        return <>{children}</>
    }
    else {
        return <p>not authorized {JSON.stringify(pass)} </p>
    }
}
