for %%s in (auth expiration junk orders) do (
  rmdir /s /q %%s\common

  mkdir %%s\common

  robocopy common\build %%s\common\build /e
  robocopy common %%s\common package.json
)
