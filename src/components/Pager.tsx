import { Grid } from "@material-ui/core"
import { Pagination, PaginationItem } from "@material-ui/lab"
import Router from "next/router"

type Props = {
  count: number
  page: number
  rowsPerPage: number
  prefix: string
}

const Pager: React.FC<Props> = (props) => {
  const { count, page, rowsPerPage, prefix } = props

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
    <Grid container justify="center">
      <Pagination
        page={page}
        count={pages}
        renderItem={(item) => {
          const l = link(item.page)
          return (
            <PaginationItem
              {...item}
              component="a"
              href={l.as}
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                e.preventDefault()
                Router.push(l.href, l.as)
              }}
            />
          )
        }}
      />
    </Grid>
  )
}

export default Pager
