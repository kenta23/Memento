import { Tags, X } from 'lucide-react';
import React, { Dispatch, KeyboardEventHandler, SetStateAction } from 'react';

function HashtagInput({ tags, setInputValue, inputValue, handleKeyDown, handleDeleteTag }: { tags: string[], setInputValue:Dispatch<SetStateAction<string>>,  inputValue: string, handleKeyDown: KeyboardEventHandler<HTMLInputElement>, handleDeleteTag: (index: number) => void }) {

  return (
    <div className='flex items-center'>
      <div className='flex items-center space-x-1  '>
        {tags.map((tag, index) => (
          <div key={index} className="flex items-center gap-1 text-red-600">
            <Tags />
            {tag}
            <button onClick={() => handleDeleteTag(index)}>
                <X />
            </button>
          </div>
        ))}
      </div>
      <Tags />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add tag"
        className='outline-none p-2'
      />
    </div>
  );
}

export default HashtagInput;