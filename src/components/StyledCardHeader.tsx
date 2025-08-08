import { CardHeader, CardHeaderProps, styled } from "@mui/material"

const StyledCardHeader = styled((props: CardHeaderProps) => (
  <CardHeader
    {...props}
    slotProps={{
      ...props.slotProps,
      title: {
        fontSize: "1rem",
      },
      subheader: {
        textAlign: "right",
        fontSize: "4rem",
      },
    }}
  />
))(({}) => ({}))

export default StyledCardHeader
