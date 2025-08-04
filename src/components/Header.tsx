"use client"

import HomeIcon from "@mui/icons-material/Home"
import MoreIcon from "@mui/icons-material/MoreVert"
import {
  AppBar,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material"
import Head from "next/head"
import { useState } from "react"

type Props = {
  title?: string
}

const Header: React.FC<Props> = (props) => {
  const { title } = props

  const [moreAnchorEl, setMoreAnchorEl] = useState<HTMLElement | undefined>(
    undefined
  )

  const handleMoreMenuClose = () => {
    setMoreAnchorEl(undefined)
  }

  return (
    <div>
      <Head>
        {title ? (
          <title>{title} | YuruVerse 2025 Progress</title>
        ) : (
          <title>YuruVerse 2025 Progress</title>
        )}
      </Head>

      <AppBar position="static">
        <Toolbar>
          <div style={{ flexGrow: 1 }}>
            <Typography variant="h6" noWrap>
              {title ? title : "YuruVerse 2025 Progress"}
            </Typography>
          </div>
          <div>
            <IconButton
              component={Link}
              href="/"
              color="inherit"
              aria-label="Home"
            >
              <HomeIcon />
            </IconButton>
            <IconButton
              aria-label="Display more actions"
              aria-haspopup="true"
              color="inherit"
              onClick={(e) => setMoreAnchorEl(e.currentTarget)}
            >
              <MoreIcon />
            </IconButton>
            <Menu
              anchorEl={moreAnchorEl}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              open={!!moreAnchorEl}
              onClose={handleMoreMenuClose}
            >
              <MenuItem
                component={Link}
                href="https://yurugp2020.mono0x.net/"
                onClick={handleMoreMenuClose}
                color="inherit"
              >
                2020
              </MenuItem>
              <MenuItem
                component={Link}
                href="https://yurugp.jp/vote/2025"
                onClick={handleMoreMenuClose}
                color="inherit"
              >
                Official Website
              </MenuItem>
              <MenuItem
                component={Link}
                href="https://github.com/mono0x/yuruverse2025-progress"
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
