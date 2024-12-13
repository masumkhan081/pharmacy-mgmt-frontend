import React from 'react'
import Input from '../common-ui/Input'
import Button from '../common-ui/Button'

export default function SearchFilter({ searchContent, setSearchContent }) {
  return (
    <div className='py-0.125 flex gap-2'>
      <Input
        type={"text"}
        value={searchContent}
        style="border"
        onChange={(e) => setSearchContent(e.target.value)}
      /><Button txt="Search"></Button>
    </div>
  )
}
