"use client"

import { Grid, Pagination, PaginationItem } from "@mui/material"
import { useRouter } from "next/navigation"

type Props = {
  count: number
  page: number
  rowsPerPage: number
  prefix: string
}

const Pager: React.FC<Props> = (props) => {
  const { count, page, rowsPerPage, prefix } = props
  const router = useRouter()

  const link = (page: number) => {
    if (page == 1) {
      return {
        href: prefix,
        as: prefix,
      }
    }
    return {
      href: `${prefix}page/[page]`,
      as: `${prefix}page/${page}`,
    }
  }

  const pages = Math.ceil(count / rowsPerPage)

  return (
    <Grid container justifyContent="center">
      <Pagination
        page={page}
        count={pages}
        renderItem={(item) => {
          if (!item.page) return <PaginationItem {...item} />
          const l = link(item.page)
          return (
            <PaginationItem
              {...item}
              component="a"
              href={l.as}
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                e.preventDefault()
                router.push(l.as)
              }}
            />
          )
        }}
      />
    </Grid>
  )
}

export default Pager
