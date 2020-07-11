import {
  AppBar,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core"
import MoreIcon from "@material-ui/icons/MoreVert"
import Head from "next/head"
import { useState } from "react"

type Props = {
  title?: string
}

const Header: React.FC<Props> = props => {
  const { title } = props

  const [moreAnchorEl, setMoreAnchorEl] = useState<HTMLElement | null>(null)

  const handleMoreMenuClose = () => {
    setMoreAnchorEl(null)
  }

  return (
    <div>
      <Head>
        {title ? (
          <title>{title} | YuruGP 2020 Progress</title>
        ) : (
            <title>YuruGP 2020 Progress</title>
          )}
      </Head>

      <AppBar position="static">
        <Toolbar>
          <div style={{ flexGrow: 1 }}>
            <Typography variant="h6" noWrap>
              {title ? title : "YuruGP 2020 Progress"}
            </Typography>
          </div>
          <div>
            <IconButton
              aria-label="Display more actions"
              aria-haspopup="true"
              color="inherit"
              onClick={e => setMoreAnchorEl(e.currentTarget)}
            >
              <MoreIcon />
            </IconButton>
            <Menu
              anchorEl={moreAnchorEl}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              open={moreAnchorEl !== null}
              onClose={handleMoreMenuClose}
            >
              <MenuItem
                component={Link}
                href="https://yurugp.jp/"
                onClick={handleMoreMenuClose}
                color="inherit"
              >
                Official Website
              </MenuItem>
              <MenuItem
                component={Link}
                href="https://github.com/mono0x/yurugp2020-progress"
                onClick={handleMoreMenuClose}
                color="inherit"
              >
                GitHub
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header
