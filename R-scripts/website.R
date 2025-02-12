# Patolojide Bilişim

updated_text <- readLines(con = "https://raw.githubusercontent.com/sbalci/patoloji-ve-bilisim/main/README.md")
 
writeLines(text = updated_text, con = "./_posts/patolojide-bilisim/updated_text.md")

header_text <- readLines(con = "./_posts/patolojide-bilisim/_header_patolojide-bilisim.Rmd")

post_text <- c(paste0(header_text), paste0(updated_text))

writeLines(text = post_text, con = "./_posts/patolojide-bilisim/patolojide-bilisim.Rmd")


# miscellaneous


updated_text2 <- readLines(con = "https://raw.githubusercontent.com/sbalci/ParaPathology/refs/heads/master/appendix/miscellaneous.md")

writeLines(text = updated_text2, con = "./_posts/miscellaneous/updated_text.md")

header_text2 <- readLines(con = "./_posts/miscellaneous/_header_miscellaneous.Rmd")

post_text2 <- c(paste0(header_text2), paste0(updated_text2))

writeLines(text = post_text2, con = "./_posts/miscellaneous/miscellaneous.Rmd")



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

