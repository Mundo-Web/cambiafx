import React, { useEffect } from 'react'

const FilterPagination = ({ current, setCurrent, pages }) => {
  const array = new Array(pages || 1)
  array.fill(null)

  const onPrevPageClicked = () => {
    const page = current--
    setCurrent(page < 1 ? 1 : page)
  }

  const onNextPageClicked = () => {
    const page = current--
    setCurrent(page > pages ? pages : page)
  }

  useEffect(() => {
    if (current > pages) setCurrent(pages);
  }, [pages, current])

  return (<>
    <nav aria-label="Page navigation example w-full">
      <ul className="flex flex-wrap items-center gap-2 -space-x-px text-base justify-center">
        <li>
          <button aria-label="Página anterior" className="cursor-pointer flex items-center justify-center px-4 h-10 w-10 leading-tight text-negro hover:bg-gray-100 hover:text-negro" onClick={onPrevPageClicked} type='button'>
            <span className="sr-only">Previous</span>
            <i className='mdi mdi-arrow-left'></i>
          </button>
        </li>
        {
          array.map((x, i) => {
            if ((i + 1) == current - 4 || (i + 1) == current + 4) {
              return <li key={`item-${i}`}>
                <button aria-label="Página actual" aria-current="page" className='z-10 flex items-center justify-center px-4 h-10 w-10 leading-tight bg-transparent text-negro hover:text-negro cursor-default' type='button'>···</button>
              </li>
            }
            return <li key={`item-${i}`} className={(i + 1) > current - 4 && (i + 1) < current + 4 ? 'block' : 'hidden'}>
              <button aria-label={`Ir a página ${i + 1}`} aria-current="page" className={`cursor-pointer z-10 flex items-center justify-center px-4 h-10 w-10 leading-tight rounded-full ${current == i + 1 ? 'bg-neutral-light text-neutral cursor-default' : 'bg-gray-100 text-negro hover:text-negro'}`} onClick={() => setCurrent(i + 1)} type='button'>{i + 1}</button>
            </li>
          })
        }
        <li>
          <button aria-label="Página siguiente" className="cursor-pointer flex items-center justify-center px-4 h-10 w-10 leading-tight text-negro hover:bg-gray-100 hover:text-negro" onClick={onNextPageClicked} type='button'>
            <span className="sr-only">Next</span>
            <i className='mdi mdi-arrow-right'></i>
          </button>
        </li>
      </ul>
    </nav>
  </>)
}

export default FilterPagination