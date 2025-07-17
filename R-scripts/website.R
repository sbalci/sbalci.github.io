# Patolojide Bilişim

updated_text <- readLines(con = "https://raw.githubusercontent.com/sbalci/patoloji-ve-bilisim/main/README.md")
 
writeLines(text = updated_text, con = "./_posts/patolojide-bilisim/updated_text.md")

header_text <- readLines(con = "./_posts/patolojide-bilisim/_header_patolojide-bilisim.Rmd")

post_text <- c(paste0(header_text), paste0(updated_text))

writeLines(text = post_text, con = "./_posts/patolojide-bilisim/patolojide-bilisim.Rmd")


# miscellaneous


updated_text2 <- readLines(con = "https://raw.githubusercontent.com/sbalci/ParaPathology/refs/heads/master/appendix/miscellaneous.md")

writeLines(text = updated_text2, con = "./_posts/miscellaneous/updated_text2.md")

header_text2 <- readLines(con = "./_posts/miscellaneous/_header_miscellaneous.Rmd")

post_text2 <- c(paste0(header_text2), paste0(updated_text2))

writeLines(text = post_text2, con = "./_posts/miscellaneous/miscellaneous.Rmd")

# users of ClinicoPathJamoviModule


# Read the .Rmd from GitHub
updated_text3 <- readLines(
  con = "https://raw.githubusercontent.com/sbalci/ClinicoPathJamoviModule/refs/heads/master/vignettes/users-of-ClinicoPath.Rmd",
  warn = FALSE
)

# Collapse lines for multi-line regex handling
updated_text3_combined <- paste(updated_text3, collapse = "\n")

# Apply regex with dot-all mode (?s) to allow newlines in matching
updated_text3_cleaned <- sub(
  pattern = "(?s)^---.*?---\\s*```\\{r, include = FALSE\\}.*?```\\s*",
  replacement = "",
  x = updated_text3_combined,
  perl = TRUE
)



# Split back into lines and overwrite the original file
writeLines(text = strsplit(updated_text3_cleaned, "\n")[[1]],  con = "./_posts/users-of-clinicopath/updated_text3.md")


header_text3 <- readLines(con = "./_posts/users-of-clinicopath/_header_users_of_clinicopath.Rmd")

post_text3 <- c(paste0(header_text3), paste0(updated_text3_cleaned))

writeLines(text = post_text3, con = "./_posts/users-of-clinicopath/users-of-clinicopath.Rmd")



# distill::import_post(
#     url = "https://raw.githubusercontent.com/sbalci/bibliometrics/master/BibliographicStudies.Rmd",
#     slug = "bibliometricstudies",
#     # date = ,
#     date_prefix = NULL,
#     check_license = FALSE,
#     overwrite = TRUE,
#     view = TRUE
# )


# my_repos <- gh::gh("GET /users/{username}/repos", username = "sbalci")
# 
# 
# my_gists <- gh::gh("GET https://api.github.com/users/{username}/gists", username = "sbalci")
# 
# my_stars <- gh::gh("GET https://api.github.com/users/{username}/starred", username = "sbalci")

