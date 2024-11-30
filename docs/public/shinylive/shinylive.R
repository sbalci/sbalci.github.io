# https://posit-dev.github.io/r-shinylive/

# install.packages("pak")
pak::pak("posit-dev/r-shinylive")

# Copy "Hello World" from `{shiny}`
system.file("examples", "01_hello", package="shiny") |>
  fs::dir_copy("myapp", overwrite = TRUE)

shinylive::export("myapp", "site")

## Get development version of `{httpuv}`
# install.packages("pak")
# pak::pak("rstudio/httpuv")
httpuv::runStaticServer("site/")
